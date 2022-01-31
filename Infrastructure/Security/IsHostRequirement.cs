using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }
    
    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirementHandler(DataContext dataContext, IHttpContextAccessor httpContextAccessor)
        {
            _dataContext = dataContext;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var activityId = _httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(q => q.Key == "id").Value?.ToString();
            
            if(userId == null || activityId == null) return Task.CompletedTask;

            var attendee = _dataContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(aa => aa.ActivityId == Guid.Parse(activityId) && aa.AppUserId == userId).Result;
            
            if(attendee == null) return Task.CompletedTask;
            
            if(attendee.IsHost) context.Succeed(requirement);
            
            return Task.CompletedTask;
        }
    }
}