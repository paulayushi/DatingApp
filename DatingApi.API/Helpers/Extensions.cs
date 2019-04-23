using System;
using Microsoft.AspNetCore.Http;

namespace DatingApi.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string msg){
            response.Headers.Add("Application-Error",msg);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }
        public static int CalculateAge(this DateTime thisDateTime){
            var age = DateTime.Today.Year - thisDateTime.Year;
            if(thisDateTime.AddYears(age) > DateTime.Today){
                age--;
            }
            return age;
        }
    }
}