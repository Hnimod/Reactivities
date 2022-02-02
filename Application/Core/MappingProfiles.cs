using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            
            CreateMap<Activity, ActivityDto>()
                .ForMember(ad => ad.HostUserName, c => c.MapFrom(
                    a => a.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(p => p.Bio, c => c.MapFrom(aa => aa.AppUser.Bio))
                .ForMember(p => p.DisplayName, c => c.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.UserName, c => c.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(p => p.Image, c => c.MapFrom(aa=> aa.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(p => p.Image, c => c.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}