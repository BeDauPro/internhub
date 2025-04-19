using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InternHub.DTOs;
using InternHub.Models;

namespace InternHub.Services.Interfaces
{
    public interface IEventService
    {
        Task<List<EventResponseDto>> GetAllEventsAsync();
        Task<EventResponseDto> GetEventByIdAsync(int eventId);
        Task<EventResponseDto> CreateEventAsync(EventCreateDto eventDto, int adminId);
        Task<EventResponseDto> UpdateEventAsync(int eventId, EventUpdateDto eventDto, int adminId);
        Task<bool> DeleteEventAsync(int eventId, int adminId);
    }
}