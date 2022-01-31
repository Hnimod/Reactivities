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
                .ForMember(ad => ad.HostUsername, c => c.MapFrom(
                    a => a.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(p => p.Bio, c => c.MapFrom(aa => aa.AppUser.Bio))
                .ForMember(p => p.DisplayName, c => c.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.Username, c => c.MapFrom(aa => aa.AppUser.UserName));
        }
    }
}