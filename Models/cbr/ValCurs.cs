using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace WebApp.Models.cbr
{
	[XmlRoot(ElementName = "Valute")]
	public class Valute
	{
		[XmlElement(ElementName = "NumCode")]
		public string NumCode { get; set; }
		[XmlElement(ElementName = "CharCode")]
		public string CharCode { get; set; }
		[XmlElement(ElementName = "Nominal")]
		public string Nominal { get; set; }
		[XmlElement(ElementName = "Name")]
		public string Name { get; set; }
		[XmlElement(ElementName = "Value")]
		public string Value { get; set; }
		[XmlAttribute(AttributeName = "ID")]
		public string ID { get; set; }
	}

	[XmlRoot(ElementName = "ValCurs")]
	public class ValCurs
	{
		[XmlElement(ElementName = "Valute")]
		public List<Valute> Valute { get; set; }
		[XmlAttribute(AttributeName = "Date")]
		public string Date { get; set; }
		[XmlAttribute(AttributeName = "name")]
		public string Name { get; set; }

		public static ValCurs DeserializeObject(DateTime date)
		{
			Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
			Encoding.GetEncoding("windows-1251");
			WebRequest request = WebRequest.Create("http://www.cbr.ru/scripts/XML_daily.asp?date_req="+date.ToShortDateString());
			request.Method = "GET";
			using (WebResponse response = request.GetResponse())
			{
				using (Stream stream = response.GetResponseStream())
				{
					XmlTextReader reader = new XmlTextReader(stream);
					XmlSerializer serializer = new XmlSerializer(typeof(ValCurs));
					return (ValCurs)serializer.Deserialize(reader);
				}
			}
		}
	}

}
