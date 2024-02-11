
import Stripe from 'stripe'

async function payment({
    payment_method_types = [''],
    mode = 'payment',
    success_url = process.env.SUCCESS_URL,
    cancel_url = process.env.CANCEL_URL,
    discounts = [],
    metadata = {},
    line_items = [],
    customer_email = ''
} = {}) {
    const stripe = new Stripe(process.env.SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        success_url,
        cancel_url,
        discounts,
        metadata,
        line_items,
        customer_email
    })
    return session
}
export default payment
// {
//     price_data: {
//         currency: 'EGP',
//         product_data: {
//             name
//         },
//         unit_amount,

//     },
//     quantity
// }