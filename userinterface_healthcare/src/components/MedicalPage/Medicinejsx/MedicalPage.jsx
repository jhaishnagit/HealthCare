import MedicineHero from "./MedicineHero";
import QuickOptions from "./QuickOptions";
import Conditions from "./Conditions";
import Brands from "./Brands";
import Deals50 from "./Deals50";
import ValueDeals from "./ValueDeals";
import MedicineList from "./MedicineList";

import medicines from "./medicines";
import valueProducts from "./valueProducts";

import "./style/medicine.css";
import MedicineNavbar from "./MedicineNavbar";

export default function MedicinePage({ addToCart }) {
     console.log("STEP 2: MedicinePage got addToCart:", addToCart);
return (
<main>
<MedicineNavbar/>
<MedicineHero />
<QuickOptions />
<Conditions />
<Deals50 addToCart={addToCart} />
<ValueDeals products={valueProducts} addToCart={addToCart} />
<MedicineList addToCart={addToCart} />
</main>
);
}