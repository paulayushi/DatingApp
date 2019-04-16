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
    }
}