using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public static class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.Body).NotEmpty();
            }
        }
        
        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.ActivityId);

                if (activity == null) return null;

                var user = await _dataContext.Users.Include(u => u.Photos)
                    .SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername(), cancellationToken);

                var comment = new Comment
                {
                    Author = user,
                    Body = request.Body,
                    Activity = activity
                };

                activity.Comments.Add(comment);

                var success = await _dataContext.SaveChangesAsync(cancellationToken) > 0;

                return success
                    ? Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment))
                    : Result<CommentDto>.Failure("Problem adding comment");
            }
        }
    }
}