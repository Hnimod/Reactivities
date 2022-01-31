using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public static class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(aa => aa.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

                if (activity == null) return null;

                var user = await _dataContext.Users
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername(), cancellationToken);

                if (user == null) return null;

                var hostUserName = activity.Attendees.FirstOrDefault(aa => aa.IsHost)?.AppUser.UserName;
                var attendance = activity.Attendees.FirstOrDefault(aa => aa.AppUser.UserName == user.UserName);

                if (attendance != null && hostUserName == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if (attendance != null && hostUserName != user.UserName)
                    activity.Attendees.Remove(attendance);
                
                if(attendance == null) 
                    activity.Attendees.Add(new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    });

                var result = await _dataContext.SaveChangesAsync(cancellationToken) > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Problem when updating attendance");
            }
        }
    }
}