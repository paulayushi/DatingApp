using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApi.API.Helpers;
using DatingApi.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApi.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync( u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photo.Where( u => u.UserId == userId).FirstOrDefaultAsync( p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photo.FirstOrDefaultAsync( p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {            
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);
            if(userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDoB = DateTime.Now.AddYears(- userParams.MaxAge - 1);
                var maxDoB = DateTime.Now.AddYears(- userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDoB && u.DateOfBirth <= maxDoB);
            }
            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch(userParams.OrderBy){
                    case "created":
                        users= users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            if(userParams.Likees)
            {
                var likees = await GetLikers(userParams.UserId, userParams.Likers);
                users = users.Where(u => likees.Contains(u.id));
            }
            if(userParams.Likers)
            {
                var likers = await GetLikers(userParams.UserId, userParams.Likers);
                users = users.Where(u => likers.Contains(u.id));
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetLikers(int userId, bool likers)
        {
            var user = await _context.Users.Include(u => u.Likers).Include(u => u.Likees)
                    .FirstOrDefaultAsync(u=> u.id == userId);
            if(likers)
            {
                return user.Likers.Where(u => u.LikeeId == userId).Select( u => u.LikerId);
            }
            else
                return user.Likees.Where(u => u.LikerId == userId).Select( u => u.LikeeId);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}