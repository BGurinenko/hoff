using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;

namespace WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RadiusLoadController : ControllerBase
    {
        private readonly ILogger<RadiusLoadController> _logger;

        public RadiusLoadController(ILogger<RadiusLoadController> logger)
        {
            _logger = logger;
        }

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public string Get()
        {
            log.Debug( "загрузка радиуса");
            return System.IO.File.ReadAllText("radius.txt");
        }
    }
}
