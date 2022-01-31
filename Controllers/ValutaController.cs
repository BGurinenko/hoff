using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApp.Models.cbr;

namespace WebApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ValutaController : ControllerBase
    {
        private readonly ILogger<ValutaController> _logger;

        public ValutaController(ILogger<ValutaController> logger)
        {
            _logger = logger;
        }

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public Valuta Get()
        {
            log.Debug("получение списка валют");
            return Valuta.DeserializeObject();
        }
    }
}
