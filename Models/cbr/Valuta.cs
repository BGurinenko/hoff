using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;
using System.Net;
using System.Text;
using System.Xml;

namespace WebApp.Models.cbr
{
	[XmlRoot(ElementName = "Item")]
	public class Item
	{
		[XmlElement(ElementName = "Name")]
		public string Name { get; set; }
		[XmlElement(ElementName = "EngName")]
		public string EngName { get; set; }
		[XmlElement(ElementName = "Nominal")]
		public string Nominal { get; set; }
		[XmlElement(ElementName = "ParentCode")]
		public string ParentCode { get; set; }
		[XmlAttribute(AttributeName = "ID")]
		public string ID { get; set; }
	}

	[XmlRoot(ElementName = "Valuta")]
	public class Valuta
	{
		[XmlElement(ElementName = "Item")]
		public List<Item> Item { get; set; }
		[XmlAttribute(AttributeName = "name")]
		public string Name { get; set; }

		public static Valuta DeserializeObject()
		{
			Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
			Encoding.GetEncoding("windows-1251");
			WebRequest request = WebRequest.Create("http://www.cbr.ru/scripts/XML_val.asp?d=0");
			request.Method = "GET";
			using (WebResponse response = request.GetResponse())
			{
				using (Stream stream = response.GetResponseStream())
				{
					XmlTextReader reader = new XmlTextReader(stream);
					XmlSerializer serializer = new XmlSerializer(typeof(Valuta));
					return (Valuta)serializer.Deserialize(reader);
				}
			}
		}
	}
}
