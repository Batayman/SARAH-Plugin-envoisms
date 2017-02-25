module.exports = {
	getNumber : function (searchCode)
	{
		var list = [
		/* Insérez vos contacts ici */
		{"name" : "Batayman", "number" : "0666666666"},
		
		
		

		{"name" : "debug", "number" : "debug"}
		];

		var value = searchCode;

		for (var i = 0; i < list.length; i++)
		{
			var object = list[i];
			if (object.name == searchCode)
			{
				value = object.number;
				break;
			}
		}
		
		return value;
	}
}