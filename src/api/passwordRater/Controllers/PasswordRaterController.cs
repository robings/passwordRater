using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace passwordRater.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PasswordRaterController : ControllerBase
    {
        [HttpPost]
        public ActionResult<PasswordRatings> Post(RatingRequest ratingRequest)
        {
            var passwordScore = RatePassword(ratingRequest.Password);

            var passwordRating = GetPasswordRating(passwordScore);

            return Ok(passwordRating);
        }

        public int RatePassword(string password)
        {
            var dodgyPasswordComponents = new string[]
            {
                "password",
            };

            var dodgyPasswordAlert = dodgyPasswordComponents.Any(p => password.ToLower().Contains(p));

            if (dodgyPasswordAlert)
            {
                return 0;
            }

            var lengthScore = ScoreLength(password.Length);
            var capsScore = ScoreCaps(password);
            var numericsScore = ScoreNumeric(password);
            var specialCharacterScore = ScoreSpecialCharacters(password);

            return lengthScore + capsScore + numericsScore + specialCharacterScore;
        }

        public PasswordRatings GetPasswordRating(int passwordScore)
        {
            switch (passwordScore)
            {
                case > 12:
                    return PasswordRatings.Excellent;
                case > 8:
                    return PasswordRatings.Good;
                case > 4:
                    return PasswordRatings.Meh;
                default:
                    return PasswordRatings.Weak;
            }
        }

        public int ScoreLength(int length)
        {
            if (length < 8)
            {
                return 0;
            }

            if (length >= 8 && length < 12)
            {
                return 1;
            }

            if (length >= 12 && length < 20)
            {
                return 2;
            }

            if (length >= 20 && length < 25)
            {
                return 3;
            }

            if (length >= 25)
            {
                return 4;
            }

            return 0;
        }

        public int ScoreCaps(string password)
        {
            Regex oneCapRegex = new Regex(@"^[A-Z]*$");
            Regex oneLowerRegex = new Regex(@"^[a-z]*$");
            Regex twoConsecutiveCapRegex = new Regex(@"[A-Z]{2}");

            var allCaps = !password.Any(c => oneLowerRegex.IsMatch(c.ToString()));
            var noCaps = !password.Any(c => oneCapRegex.IsMatch(c.ToString()));
            if (allCaps || noCaps)
            {
                return 0;
            }

            if (
                password.Count(c => oneCapRegex.IsMatch(c.ToString())) == 1 &&
                oneCapRegex.IsMatch(password[0].ToString()) ||
                oneCapRegex.IsMatch(password[password.Length-1].ToString())
            )
            {
                return 1;
            }

            if (password.Count(c => oneCapRegex.IsMatch(c.ToString())) == 1)
            {
                return 2;
            }

            if (password.Count(c => oneCapRegex.IsMatch(c.ToString())) == 2 && twoConsecutiveCapRegex.IsMatch(password))
            {
                return 3;
            }

            if (password.Count(c => oneCapRegex.IsMatch(c.ToString())) >= 2)
            {
                return 4;
            }

            return 0;
        }

        public int ScoreNumeric(string password)
        {
            Regex oneNumericRegex = new Regex(@"^[0-9]*$");

            var numberOfNumerics = password.Count(c => oneNumericRegex.IsMatch(c.ToString()));

            if (numberOfNumerics < 4)
            {
                return numberOfNumerics;
            }

            if (numberOfNumerics >= 4)
            {
                return 4;
            }

            return 0;
        }

        public int ScoreSpecialCharacters(string password)
        {
            Regex oneAlphaNumericRegex = new Regex(@"^[0-9a-zA-Z]*$");

            var numberOfSpecialCharacters = password.Count(c => !oneAlphaNumericRegex.IsMatch(c.ToString()));

            if (numberOfSpecialCharacters < 4)
            {
                return numberOfSpecialCharacters;
            }

            if (numberOfSpecialCharacters >= 4)
            {
                return 4;
            }

            return 0;
        }
    }
}
