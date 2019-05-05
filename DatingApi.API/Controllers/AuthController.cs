using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApi.API.Data;
using DatingApi.API.DTO;
using DatingApi.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserToRegister userToRegister)
        {
            userToRegister.Username = userToRegister.Username.ToLower();
            if (await _repo.UserExist(userToRegister.Username)) return BadRequest("User already exists!");

            var userToCreate = _mapper.Map<User>(userToRegister);
            var createdUser = await _repo.Register(userToCreate, userToRegister.Password);
            
            var userDetails = _mapper.Map<UserForDetailedDto>(createdUser);
            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.id }, userDetails);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserToLogin userToLogin)
        {
            if (userToLogin != null && !string.IsNullOrEmpty(userToLogin.Username))
            {
                var userFromRepo = await _repo.Login(userToLogin.Username.ToLower(), userToLogin.Password);
                if (userFromRepo == null)
                    return Unauthorized();
                var claims = new[]{
                        new Claim(ClaimTypes.NameIdentifier, userFromRepo.id.ToString()),
                        new Claim(ClaimTypes.Name, userFromRepo.Username)
                    };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
                var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = cred
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);

                var currentUser = _mapper.Map<UserForListDto>(userFromRepo);

                return Ok(new
                {
                    token = tokenHandler.WriteToken(token),
                    currentUser
                });
            }
            else
                return Unauthorized();
        }
    }
}