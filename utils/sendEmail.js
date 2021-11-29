const nodemailer = require('nodemailer');

async function sendEmail(errand, errandID, attachmentData) {

	const date = new Date();
	currentTime = date.toISOString();
	currentTime = currentTime.replace('T', ' ');
	currentTime = currentTime.substring(0,19);

	let transporter = nodemailer.createTransport({
		host: 'mailrelay.sundsvall.se',
		port: 25
	});

	let info = await transporter.sendMail({
		from: '"Incident API" <felanmalan@sundsvall.se>',
		to: process.env.EMAIL_TO,
		subject: 'Det har inkommit en felanmälan.',
		attachments: attachmentData,
		html: `<h2>Felanmälan</h2>
		<br />
		<div style="margin-left:40px;">	
			<p>BESKRIVNING</p>
			<p>Text: ${errand[6]}</p>
			<p>Bild: Se bilagor</p>
			<p>Skapad: ${currentTime}</p>	

			<br />

			<p>PLATS</p>
			<p><a href="https://www.google.com/maps/search/?api=1&query=${errand[7]}">Se på karta</a></p>

			<br />

			<p>TAGGAR</p>

			<br />

			<p>KONTAKT</p>
			<p>Email: ${errand[3]}</p>
			<p>Telefon: ${errand[2]}</p>

			<br />

			<p>ÄNDRA STATUS</p>
			<p><a href="${process.env.APP_URI}/api/statusupdate?errandid=${errandID}&status=1">Öppnat</a> | <a href="${process.env.APP_URI}/api/statusupdate?errandid=${errandID}&status=2">Avslutat</a> | <a href="${process.env.APP_URI}/api/statusupdate?errandid=${errandID}&status=3">Avvisat</a></p>

			<br />

			<p>VERKSAMHET</p>
			<p>Förslag: ---</p>

			<br />

			<p>FEEDBACK (Ärendet ska till: )</p>
			<a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=Stadsbyggnadskontoret">Stadsbyggnadskontoret</a> | <a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=Trafikverket">Trafikverket</a> | <a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=Drakfastigheter">Drakfastigheter</a> |
			 <a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=SKIFU">SKIFU</a> | <a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=MSVA">MSVA</a> | <a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=Eln%C3%A4t">Elnät</a> | <a href="${process.env.APP_URI}/api/setincidentfeedback?errandid=${errandID}&feedback=Motionssp%C3%A5r">Motionsspår</a>
			</p>

			<br />

			<p>PROBLEM</p>
			<p>Saknas bilden eller kan inte ärendet uppdateras, skicka då till: <a href="mailto:sawsm@cybercom.com">Medborgarappen Support</a></p>
			
			<br />

			<p>Ha en bra dag!</p>
			<p>Mvh MedborgarAppen</p>
		</div>
		`
	});

	console.log("Message sent: %s", info.messageId);

	return;
};

module.exports.sendEmail = sendEmail;