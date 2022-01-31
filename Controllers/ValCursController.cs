using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using WebApp.Models.cbr;

namespace WebApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ValCursController : ControllerBase
    {
        private readonly ILogger<ValCursController> _logger;

        public ValCursController(ILogger<ValCursController> logger)
        {
            _logger = logger;
        }

        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public ValCurs Get(string date)
        {
            log.Debug("получение данных курса на дату " + date);
            var res = ValCurs.DeserializeObject(DateTime.Parse(date));
            if (DateTime.Parse(res.Date) != DateTime.Parse(date)) res.Name = "Нет данных на дату " + DateTime.Parse(date).ToShortDateString();
            return res;
        }
    }
}
