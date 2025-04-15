using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternHub.DTOs;
using InternHub.Services.Interfaces;

namespace InternHub.Controllers
{
    [ApiController]
    public class StudentEventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public StudentEventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        // GET: api/student/events
        [Route("api/student/events")]
        [HttpGet]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> GetEvents()
        {
            try
            {
                var events = await _eventService.GetAllEventsAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/student/events/5
        [Route("api/student/events/{id}")]
        [HttpGet]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<EventResponseDto>> GetEvent(int id)
        {
            try
            {
                var eventEntity = await _eventService.GetEventByIdAsync(id);

                if (eventEntity == null)
                {
                    return NotFound(new { message = $"Không tìm thấy sự kiện với Id: {id}" });
                }

                return Ok(eventEntity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}