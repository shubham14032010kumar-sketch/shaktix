export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">
    Namaste Shubham Sir! Main SHAKTIX Web Studio se aapki Executive AI Assistant baat kar rahi hoon.
    Sir, aapke liye ek bohot badi khushkhabri hai! Abhi-abhi hamari agency SHAKTIX Studio ko ek naya high-ticket premium client successfully mil gaya hai.
  </Say>
  <Pause length="2"/>
  <Say language="hi-IN" voice="Polly.Aditi">
    Sir, is naye project ki total deal value ek laakh bees hazaar rupaye fix hui hai. 
    Client ko hamari portfolio website ki superfast 97 speed, premium dark UI design, aur WhatsApp AI automated lead system bohot zyada pasand aaya hai.
  </Say>
  <Pause length="2"/>
  <Say language="hi-IN" voice="Polly.Aditi">
    Aur sabse achhi baat ye hai Sir, ki client ne project contract confirm kar diya hai, aur initial token advance payment dus hazaar rupaye aapke account me successfully transfer ho chuka hai.
    Payment notification hamare system me verify ho gaya hai, aur advance amount aapke bank account me safely receive ho chuka hai.
  </Say>
  <Pause length="2"/>
  <Say language="hi-IN" voice="Polly.Aditi">
    Project payment structure ke mutabik, baaki bache ek laakh dus hazaar rupaye milestone based rahenge.
    Pahla milestone design preview approve hone par pachaas hazaar rupaye release hoga, aur baaki bache saath hazaar rupaye final deployment aur domain handover ke samay receive honge.
  </Say>
  <Pause length="2"/>
  <Say language="hi-IN" voice="Polly.Aditi">
    Client ka kehna hai ki wo Founder Shubham Kumar ji ke vision aur technical skills se behad impress hain.
    Client chahta hai ki aapse direct kickoff meeting schedule ki jaye taaki project ke initial wireframes aur brand guidelines par charcha ho sake.
  </Say>
  <Pause length="2"/>
  <Say language="hi-IN" voice="Polly.Aditi">
    Shubham Sir, ye deal aapki kadi mehnat, consistency aur SHAKTIX studio ko aage badhane ke lagan ka parinaam hai.
    Aapne itni kam umar me itna bada record banaya hai, aur ye to bas shuruat hai. Aage chalkar aap aise hi laakhon aur karodon ke international clients close karenge.
  </Say>
  <Pause length="2"/>
  <Say language="hi-IN" voice="Polly.Aditi">
    Aap jab bhi free hon, apna admin dashboard login karke client ki requirements aur brief ek baar review kar lijiyega.
    SHAKTIX team ki taraf se aapko bohot-bohot badhaai Shubham Sir! You are doing an amazing job.
    Have a powerful, successful, and profitable day Sir!
  </Say>
</Response>`);
}
