exports.action = function(data, callback, cfg, SARAH){
		
	//Mettre debug à true si le plugin ne fonctionne pas
	var debug = false;

	// Fonction qui envoie le message
	function sendMessage(contactNumber, messageText, cfg, reponse){
		var config = cfg.modules.sms;
		var reponseSarah = config.reponse;

		// On vérifie si toutes les informations ont été renseignées dans le fichier .prop
		if (!config.access_token || !config.target_device_iden || !config.source_user_iden){
			console.log("Manque des informations");
			reponse(false);
		}
		
		// On structure la requête à envoyer
		var request = require('request');
		var body = 	{
			push : {
				'conversation_iden'	: contactNumber,
				'message'			: messageText,
				'package_name'		: 'com.pushbullet.android',
				'type'				: 'messaging_extension_reply',
				'target_device_iden': config.target_device_iden,
				'source_user_iden'	: config.source_user_iden
			},
			type : 'push'
		}
			
		if(debug) console.log("Body = ",body);
		
		var options = {
			method: 'POST',
			url: 'https://api.pushbullet.com/v2/ephemerals',
			headers: {
				'Content-Type':  'application/json',
				'Access-Token': config.access_token
				},
			json: true,
			body: body
		};
			
		if(debug) console.log("Options = ",options);
		
		// On envoi la requête
		request(options, function (err, response, body){
			if (typeof err=='null' || (typeof response == 'undefined')) {
				console.log('No Communication!');
				reponse(false);
			}
			else if  (response.statusCode != 200) {
				console.log('answer error!');
				reponse(false);
			}
			else if  (response.statusCode == 200) {
				setTimeout(function() { reponse(true); }, 100);
			}
		});
	}

		
	// On vérifie que le fichier XML a bien été renseigné
	if (typeof data.destinataire!='undefined') {
		
		// Récupération du numéro dans la liste des contacts
		var listeContacts = require('./listeContacts');
		var numero = listeContacts.getNumber(data.destinataire.toLowerCase());
		
		// Retrait du texte de la commande vocale pour ne garder que le contenu du sms
		if (!data.dictation){
			return callback({'tts': "Je ne comprends pas"});
		}
		
		var prenom = data.destinataire;
		var str = data.dictation;
		var patt1 = new RegExp(prenom, "i"); //si prenom = jean alors patt1 = jean/i
		patt1.test(str);
		var texte = RegExp.rightContext;
		
		
		if (data.destinataire!=numero){
			sendMessage(numero, texte, cfg, function(reponse) {
				if (reponse==true) {
					console.log("Message à " + data.destinataire + " envoyé.");
					Txt = new Array; 
					Txt[0] = "Le message a été envoyé.";
					Txt[1] = "Message envoyé à " + data.destinataire + ".";
					Txt[2] = "ok !";
					Txt[3] = "Message envoyé.";
					Choix = Math.floor(Math.random() * Txt.length); 
					callback({'tts': Txt[Choix]});
				
					return reponse;
				}
				else {
					console.log(reponse);
					callback({'tts': 'je n\'ai pas réussis!'});
				}
			});
		}
		else if  (numero=="debug") {
				callback({'tts': 'Message de debug éxécuté.'});
		}
		else{
			callback({'tts': 'Ce contact n\'est pas renseigné dans le fichier contacts!'});
		}
	}
	else {
		console.log('Erreur dans le XML ('+data.destinataire+')');
		callback({'tts': 'Il y a une erreur dans le XML'});
	}
	
}
