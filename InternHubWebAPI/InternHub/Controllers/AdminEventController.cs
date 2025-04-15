using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InternHub.DTOs;
using InternHub.Services.Interfaces;
using InternHub.Models;

namespace InternHub.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    // Bỏ comment dòng dưới khi cần áp dụng xác thực
    // [Authorize(Roles = "Admin")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly AppDbContext _context;

        public EventController(IEventService eventService, AppDbContext context)
        {
            _eventService = eventService;
            _context = context;
        }

        // GET: api/admin/Event
        [HttpGet]
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

        // GET: api/admin/Event/5
        [HttpGet("{id}")]
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

        // POST: api/admin/Event
        [HttpPost]
        public async Task<ActionResult<EventResponseDto>> CreateEvent(EventCreateDto eventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Lấy Admin đầu tiên từ cơ sở dữ liệu
                var admin = await _context.Admins.FirstOrDefaultAsync();
                if (admin == null)
                {
                    return BadRequest(new { error = "Không tìm thấy admin trong hệ thống" });
                }

                var createdEvent = await _eventService.CreateEventAsync(eventDto, admin.AdminId);

                return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.EventId }, createdEvent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // PUT: api/admin/Event/5
        [HttpPut("{id}")]
        public async Task<ActionResult<EventResponseDto>> UpdateEvent(int id, EventUpdateDto eventDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Lấy Admin đầu tiên từ cơ sở dữ liệu
                var admin = await _context.Admins.FirstOrDefaultAsync();
                if (admin == null)
                {
                    return BadRequest(new { error = "Không tìm thấy admin trong hệ thống" });
                }

                var updatedEvent = await _eventService.UpdateEventAsync(id, eventDto, admin.AdminId);

                if (updatedEvent == null)
                {
                    return NotFound(new { message = $"Không tìm thấy sự kiện với Id: {id}" });
                }

                return Ok(updatedEvent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // DELETE: api/admin/Event/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEvent(int id)
        {
            try
            {
                // Lấy Admin đầu tiên từ cơ sở dữ liệu
                var admin = await _context.Admins.FirstOrDefaultAsync();
                if (admin == null)
                {
                    return BadRequest(new { error = "Không tìm thấy admin trong hệ thống" });
                }

                var result = await _eventService.DeleteEventAsync(id, admin.AdminId);

                if (!result)
                {
                    return NotFound(new { message = $"Không tìm thấy sự kiện với Id: {id}" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}