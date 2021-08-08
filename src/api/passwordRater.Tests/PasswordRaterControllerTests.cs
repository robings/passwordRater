using System;
using System.Threading.Tasks;
using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;
using passwordRater.Controllers;

namespace passwordRater.Tests
{
    public class PasswordRaterControllerTests
    {
        public PasswordRaterController _passwordRaterController;

        [SetUp]
        public void SetUp()
        {
            _passwordRaterController = new PasswordRaterController();
        }

        [TestCase("pass", PasswordRatings.Weak)]
        [TestCase("password", PasswordRatings.Weak)]
        [TestCase("Password", PasswordRatings.Weak)]
        [TestCase("Password1234", PasswordRatings.Weak)]
        [TestCase("Longerwithcap", PasswordRatings.Weak)]
        [TestCase("eXtralongwithicaptoo", PasswordRatings.Meh)]
        [TestCase("eXtralongwithcap1too", PasswordRatings.Meh)]
        [TestCase("eXtralongwithcap1234", PasswordRatings.Good)]
        [TestCase("eXtralongwithcap1234!", PasswordRatings.Good)]
        [TestCase("eXtralong&withcap1234!", PasswordRatings.Good)]
        [TestCase("eXtralong&withcap*1234!", PasswordRatings.Good)]
        [TestCase("_eXtralong&withcap*1234!", PasswordRatings.Excellent)]
        [TestCase("_eXtraextralong&withcap*1234!", PasswordRatings.Excellent)]
        [TestCase("_eXtraeXtralong&withcap*1234!", PasswordRatings.Excellent)]
        public void Get_ReturnsExpectedRatingForGivenPassword(string password, PasswordRatings passwordRating)
        {
            var ratingRequest = new RatingRequest { Password = password };
            var result = _passwordRaterController.Post(ratingRequest);
            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());
            Assert.That(((OkObjectResult)result.Result).Value, Is.EqualTo(passwordRating));
        }
    }
}
