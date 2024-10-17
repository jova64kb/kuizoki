using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuthentication(
	CookieAuthenticationDefaults.AuthenticationScheme)
	.AddCookie(options => {
		options.ExpireTimeSpan = TimeSpan.FromMinutes(1);
		options.SlidingExpiration = true;
	});
builder.Services.AddAuthorizationBuilder()
	.AddPolicy("admin_only", policy =>
		policy.RequireRole("admin")
			.RequireClaim("hello", "true"));

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Hello World!");

app.MapGet("/msg", () => "fetched from backend.");

app.MapPost("/echo", async (HttpRequest req) => {
	Char[] buffer;
	using (var sr = new StreamReader(req.Body)) {
		buffer = new Char[(int)req.ContentLength]; // null?
		await sr.ReadAsync(buffer, 0, (int)req.ContentLength); // null?
	}
	return Results.Ok(new String(buffer));
});

// json or form data when implementing client?
app.MapPost("/login", async (HttpRequest req, HttpContext ctx) => {
	var form = await req.ReadFormAsync();
	
	// authenticate user
	
	var claims = new List<Claim> {
		new Claim(ClaimTypes.Name, form["email"]), // null?
		new Claim(ClaimTypes.Role, "admin"),
		new Claim("hello", "true")
	};

	var claimsIdentity = new ClaimsIdentity(
		claims, CookieAuthenticationDefaults.AuthenticationScheme);

	// AuthenticationProperties

	await ctx.SignInAsync(
		CookieAuthenticationDefaults.AuthenticationScheme,
		new ClaimsPrincipal(claimsIdentity));

	return Results.Ok($"{form["email"]} {form["password"]}"); // null?
});

app.MapGet("/hello-admin", () => "hello admin")
	.RequireAuthorization("admin_only");

app.Run();
