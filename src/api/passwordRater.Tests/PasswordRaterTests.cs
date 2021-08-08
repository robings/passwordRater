using NUnit.Framework;
using passwordRater.Controllers;

namespace passwordRater.Tests
{
    public class PasswordRaterTests
    {
        public PasswordRaterController _passwordRaterController;

        [SetUp]
        public void SetUp()
        {
            _passwordRaterController = new PasswordRaterController();
        }

        [TestCase(0)]
        [TestCase(-1)]
        [TestCase(3)]
        [TestCase(7)]
        public void ScoreLength_Given_Number_Below_8_Returns_0(int number)
        {
            Assert.That(_passwordRaterController.ScoreLength(number), Is.Zero);
        }

        [TestCase(8)]
        [TestCase(9)]
        [TestCase(11)]
        public void ScoreLength_Given_Number_Between_8_And_11_Returns_1(int number)
        {
            Assert.That(_passwordRaterController.ScoreLength(number), Is.EqualTo(1));
        }

        [TestCase(12)]
        [TestCase(16)]
        [TestCase(19)]
        public void ScoreLength_Given_Number_Between_12_And_19_Returns_2(int number)
        {
            Assert.That(_passwordRaterController.ScoreLength(number), Is.EqualTo(2));
        }

        [TestCase(20)]
        [TestCase(23)]
        [TestCase(24)]
        public void ScoreLength_Given_Number_Between_20_And_24_Returns_3(int number)
        {
            Assert.That(_passwordRaterController.ScoreLength(number), Is.EqualTo(3));
        }

        [TestCase(25)]
        [TestCase(30)]
        [TestCase(50)]
        public void ScoreLength_Given_Number_MoreThan_24_Returns_4(int number)
        {
            Assert.That(_passwordRaterController.ScoreLength(number), Is.EqualTo(4));
        }

        [TestCase("ALLCAPS")]
        [TestCase("nocaps")]
        [TestCase("ALLCAPS1")]
        [TestCase("nocaps1")]
        public void ScoreCaps_GivenNoVarietyInCapitalization_Returns_0(string password)
        {
            Assert.That(_passwordRaterController.ScoreCaps(password), Is.Zero);
        }

        [TestCase("Passwordwith1cap")]
        [TestCase("passwordwith1caP")]
        public void ScoreCaps_GivenOneCapAsFirstOrLastCharacter_Returns_1(string password)
        {
            Assert.That(_passwordRaterController.ScoreCaps(password), Is.EqualTo(1));
        }

        [TestCase("paSswordwith1cap")]
        [TestCase("passwordWith1cap")]
        public void ScoreCaps_GivenOneCapAnywhereExceptFirstOrLast_Returns_2(string password)
        {
            Assert.That(_passwordRaterController.ScoreCaps(password), Is.EqualTo(2));
        }

        [TestCase("paSSwordwith2cap")]
        [TestCase("passworDWith2cap")]
        public void ScoreCaps_GivenTwoCapsButConsecutive_Returns_3(string password)
        {
            Assert.That(_passwordRaterController.ScoreCaps(password), Is.EqualTo(3));
        }

        [TestCase("paSwordwIthMuLticap")]
        [TestCase("pasSworDWith3Cap")]
        [TestCase("pasSworDith3Cap")]
        [TestCase("PAsSworDith3Cap")]
        public void ScoreCaps_GivenTwoOrMoreCaps_IfTwoNotConsecutive_Returns_4(string password)
        {
            Assert.That(_passwordRaterController.ScoreCaps(password), Is.EqualTo(4));
        }

        [TestCase("Password", 0)]
        [TestCase("Password2", 1)]
        [TestCase("Password23", 2)]
        [TestCase("Password234", 3)]
        [TestCase("Password3456", 4)]
        public void ScoreNumeric_GivenNumbersInPassword_ScoresAccordingly(string password, int expectedScore)
        {
            Assert.That(_passwordRaterController.ScoreNumeric(password), Is.EqualTo(expectedScore));
        }

        [TestCase("Password", 0)]
        [TestCase("Password!", 1)]
        [TestCase("Password!&", 2)]
        [TestCase("Password!&(", 3)]
        [TestCase("Password!*^%", 4)]
        public void ScoreSpecialCharacters_GivenCharactersInPassword_ScoresAccordingly(string password, int expectedScore)
        {
            Assert.That(_passwordRaterController.ScoreSpecialCharacters(password), Is.EqualTo(expectedScore));
        }

        [TestCase("pass", 0)]
        [TestCase("password", 0)]
        [TestCase("Password", 0)]
        [TestCase("Password1234", 0)]
        [TestCase("Longerwithcap", 3)]
        [TestCase("eXtralongwithicaptoo", 5)]
        [TestCase("eXtralongwithcap1too", 6)]
        [TestCase("eXtralongwithcap1234", 9)]
        [TestCase("eXtralongwithcap1234!", 10)]
        [TestCase("eXtralong&withcap1234!", 11)]
        [TestCase("eXtralong&withcap*1234!", 12)]
        [TestCase("_eXtralong&withcap*1234!", 13)]
        [TestCase("_eXtraextralong&withcap*1234!", 14)]
        [TestCase("_eXtraeXtralong&withcap*1234!", 16)]
        public void RatePassword_ReturnsExpectedRatingForGivenPassword(string password, int passwordScore)
        {
            Assert.That(_passwordRaterController.RatePassword(password), Is.EqualTo(passwordScore));
        }
    }
}