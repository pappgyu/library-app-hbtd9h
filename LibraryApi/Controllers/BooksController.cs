using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class BooksController : ControllerBase
{
    private readonly BookService _service;
    private static bool IsValidMongoId(string id) =>
        Regex.IsMatch(id, @"^[a-fA-F0-9]{24}$");

    public BooksController(BookService service) => _service = service;

    /// <summary>Összes könyv lekérése</summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<Book>), 200)]
    public async Task<List<Book>> GetAll() => await _service.GetAllAsync();

    /// <summary>Keresés cím, műfaj vagy leírás alapján</summary>
    /// <param name="title">Keresett cím (opcionális)</param>
    /// <param name="genre">Keresett műfaj (opcionális)</param>
    [HttpGet("search")]
    [ProducesResponseType(typeof(List<Book>), 200)]
    public async Task<ActionResult<List<Book>>> Search(
        [FromQuery] string? title,
        [FromQuery] string? genre)
    {
        var books = await _service.GetAllAsync();
        var result = books.AsQueryable();

        if (!string.IsNullOrEmpty(title))
            result = result.Where(b => b.Title != null &&
                b.Title.Contains(title, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrEmpty(genre))
            result = result.Where(b => b.Genre != null &&
                b.Genre.Contains(genre, StringComparison.OrdinalIgnoreCase));

        return Ok(result.ToList());
    }

    /// <summary>Egy könyv lekérése ID alapján</summary>
    /// <param name="id">A könyv azonosítója</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Book), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<Book>> GetById(string id)
    {
        if (!IsValidMongoId(id))
            return BadRequest(new { message = "Érvénytelen ID formátum. A MongoDB ID 24 karakteres hex string." });

        var book = await _service.GetByIdAsync(id);
        if (book is null)
            return NotFound(new { message = $"A könyv nem található. ID: {id}" });
        return Ok(book);
    }

    /// <summary>Új könyv létrehozása</summary>
    /// <param name="book">A létrehozandó könyv adatai</param>
    [HttpPost]
    [ProducesResponseType(typeof(Book), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<Book>> Create(Book book)
    {
        if (string.IsNullOrWhiteSpace(book.Title))
            return BadRequest(new { message = "A cím megadása kötelező." });

        var created = await _service.CreateAsync(book);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Könyv módosítása</summary>
    /// <param name="id">A könyv azonosítója</param>
    /// <param name="updated">A módosított könyv adatai</param>
    [HttpPut("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(string id, Book updated)
    {
        if (!IsValidMongoId(id))
            return BadRequest(new { message = "Érvénytelen ID formátum. A MongoDB ID 24 karakteres hex string." });

        if (string.IsNullOrWhiteSpace(updated.Title))
            return BadRequest(new { message = "A cím megadása kötelező." });

        var existing = await _service.GetByIdAsync(id);
        if (existing is null)
            return NotFound(new { message = $"A könyv nem található. ID: {id}" });

        updated.Id = id;
        await _service.UpdateAsync(id, updated);
        return NoContent();
    }

    /// <summary>Könyv törlése</summary>
    /// <param name="id">A könyv azonosítója</param>
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(string id)
    {
        if (!IsValidMongoId(id))
            return BadRequest(new { message = "Érvénytelen ID formátum. A MongoDB ID 24 karakteres hex string." });

        var existing = await _service.GetByIdAsync(id);
        if (existing is null)
            return NotFound(new { message = $"A könyv nem található. ID: {id}" });

        await _service.DeleteAsync(id);
        return NoContent();
    }
}
