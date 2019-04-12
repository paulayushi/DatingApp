using System.ComponentModel.DataAnnotations;

namespace DatingApi.API.DTO
{
    public class UserToRegister
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8,MinimumLength=4,ErrorMessage="Password should be in between 4 to 8 character length!")]
        public string Password { get; set; }
    }
}