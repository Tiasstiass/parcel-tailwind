// shoplab console.log branding
export default function () {
  //put code here
  const brand1 = ["background: #000639", "padding: 20px", "color: #fff", "font-size: 1.9em", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif', "font-weight: bold", "width: 400px"].join(";"),
    brand2 = ["background: #fff", "padding: 0px", "color: #000639", "font-size: 1.1em", "line-height: 1.2em", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif', "font-weight: bold", "text-decoration: none", "width: 400px"].join(";");
  console && console.log && (console.log("%c shoplab", brand1), console.log("%c Shopify Experts \n www.shoplab.cc", brand2))
}