using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InternHub.DTOs;
using InternHub.Models;
using InternHub.Services.Interfaces;

namespace InternHub.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;

        public EventService(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<EventResponseDto>> GetAllEventsAsync()
        {
            var events = await _context.Events
                .Select(e => new EventResponseDto
                {
                    EventId = e.EventId,
                    EventTitle = e.EventTitle,
                    EventDesc = e.EventDesc,
                    EventDate = e.EventDate,
                    EventLocation = e.EventLocation,
                    Organizer = e.Organizer,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return events;
        }

        public async Task<EventResponseDto> GetEventByIdAsync(int eventId)
        {
            var eventEntity = await _context.Events
                .FirstOrDefaultAsync(e => e.EventId == eventId);

            if (eventEntity == null)
                return null;

            return new EventResponseDto
            {
                EventId = eventEntity.EventId,
                EventTitle = eventEntity.EventTitle,
                EventDesc = eventEntity.EventDesc,
                EventDate = eventEntity.EventDate,
                EventLocation = eventEntity.EventLocation,
                Organizer = eventEntity.Organizer,
                CreatedAt = eventEntity.CreatedAt
            };
        }

        public async Task<EventResponseDto> CreateEventAsync(EventCreateDto eventDto, int adminId)
        {
            var admin = await _context.Admins.FindAsync(adminId);
            if (admin == null)
                throw new Exception("Admin not found");

            var eventEntity = new Event
            {
                EventTitle = eventDto.EventTitle,
                EventDesc = eventDto.EventDesc,
                EventDate = eventDto.EventDate,
                EventLocation = eventDto.EventLocation,
                Organizer = eventDto.Organizer,
                CreatedAt = DateTime.UtcNow,
                CreatedByAdminId = adminId
            };

            _context.Events.Add(eventEntity);
            await _context.SaveChangesAsync();

            return new EventResponseDto
            {
                EventId = eventEntity.EventId,
                EventTitle = eventEntity.EventTitle,
                EventDesc = eventEntity.EventDesc,
                EventDate = eventEntity.EventDate,
                EventLocation = eventEntity.EventLocation,
                Organizer = eventEntity.Organizer,
                CreatedAt = eventEntity.CreatedAt
            };
        }

        public async Task<EventResponseDto> UpdateEventAsync(int eventId, EventUpdateDto eventDto, int adminId)
        {
            var eventEntity = await _context.Events
                .FirstOrDefaultAsync(e => e.EventId == eventId);

            if (eventEntity == null)
                return null;

            // Verify that the admin is the creator of the event
            if (eventEntity.CreatedByAdminId != adminId)
                throw new UnauthorizedAccessException("You are not authorized to update this event");

            // Update event properties
            eventEntity.EventTitle = eventDto.EventTitle;
            eventEntity.EventDesc = eventDto.EventDesc;
            eventEntity.EventDate = eventDto.EventDate;
            eventEntity.EventLocation = eventDto.EventLocation;
            eventEntity.Organizer = eventDto.Organizer;

            _context.Events.Update(eventEntity);
            await _context.SaveChangesAsync();

            return new EventResponseDto
            {
                EventId = eventEntity.EventId,
                EventTitle = eventEntity.EventTitle,
                EventDesc = eventEntity.EventDesc,
                EventDate = eventEntity.EventDate,
                EventLocation = eventEntity.EventLocation,
                Organizer = eventEntity.Organizer,
                CreatedAt = eventEntity.CreatedAt
            };
        }

        public async Task<bool> DeleteEventAsync(int eventId, int adminId)
        {
            var eventEntity = await _context.Events.FindAsync(eventId);

            if (eventEntity == null)
                return false;

            // Verify that the admin is the creator of the event
            if (eventEntity.CreatedByAdminId != adminId)
                throw new UnauthorizedAccessException("You are not authorized to delete this event");

            _context.Events.Remove(eventEntity);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}