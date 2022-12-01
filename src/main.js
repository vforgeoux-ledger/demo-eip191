import 'core-js/actual';
import { listen } from "@ledgerhq/logs";
import Eth from "@ledgerhq/hw-app-eth";

// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
// import TransportWebHID from "@ledgerhq/hw-transport-webhid";

//Display the header in the div which has the ID "main"
const initial = "<h1>Connect your Nano and open the Ethereum app. Click anywhere to start...</h1>";
const $main = document.getElementById("main");
$main.innerHTML = initial;

document.querySelector("#hashMessage").addEventListener("click", async () => {
 $main.innerHTML = initial;
 try {

   //trying to connect to your Ledger device with USB protocol
   const transport = await TransportWebUSB.create();

   //trying to connect to your Ledger device with HID protocol
   // const transport = await TransportWebHID.create();

   //listen to the events which are sent by the Ledger packages in order to debug the app
   listen(log => console.log(log))

   //When the Ledger device connected it is trying to display the ethereum address
   const eth = new Eth(transport);
   const signature = await eth.signPersonalMessage("44'/60'/0'/0/0", Buffer.from(document.getElementById("message").value).toString("hex"));
   const signedHash = "0x" + signature.r + signature.s + signature.v.toString(16);

   //Display your ethereum address on the screen
   const h2 = document.createElement("h2");
   h2.textContent = signedHash;
   $main.innerHTML = "<h1>Your signed message:</h1>";
   $main.appendChild(h2);

   //Display the address on 44'/60'/0'/0/0 path
   const { address } = await eth.getAddress("44'/60'/0'/0/0");
   const add = document.createElement("h3");
   add.textContent = "Your ETH address (path 44'/60'/0'/0/0) : " + address;
   $main.appendChild(add);
 } catch (e) {

   //Catch any error thrown and displays it on the screen
   const $err = document.createElement("code");
   $err.style.color = "#f66";
   $err.textContent = String(e.message || e);
   $main.appendChild($err);
 }
});