// Meta Pixel (671798165173716) — checkout.
// Halaman checkout Shopify tidak memuat theme, jadi kode ini TIDAK ikut ter-deploy dengan theme.
// Pasang manual: Shopify Admin > Settings > Customer events > Add custom pixel > paste kode ini > Connect.
// PageView & ViewContent di storefront sudah ditangani snippets/meta-pixel.liquid.

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '671798165173716');

function checkoutParams(checkout) {
  var items = checkout.lineItems || [];
  return {
    content_ids: items.map(function (i) { return String(i.variant.product.id); }),
    content_type: 'product',
    contents: items.map(function (i) {
      return { id: String(i.variant.product.id), quantity: i.quantity };
    }),
    num_items: items.reduce(function (n, i) { return n + i.quantity; }, 0),
    value: checkout.totalPrice ? checkout.totalPrice.amount : 0,
    currency: checkout.currencyCode
  };
}

// PageView di halaman checkout & thank-you (storefront sudah dari theme, jadi dilewati agar tidak dobel)
analytics.subscribe('page_viewed', function (event) {
  var path = event.context.document.location.pathname;
  if (/\/checkouts?\/|\/thank[-_]you|\/orders\//.test(path)) fbq('track', 'PageView');
});

analytics.subscribe('checkout_started', function (event) {
  var checkout = event.data.checkout;
  fbq('track', 'InitiateCheckout', checkoutParams(checkout), { eventID: 'ic_' + checkout.token });
});

analytics.subscribe('checkout_completed', function (event) {
  var checkout = event.data.checkout;
  var orderId = checkout.order && checkout.order.id ? checkout.order.id : checkout.token;
  fbq('track', 'Purchase', checkoutParams(checkout), { eventID: 'purchase_' + orderId });
});
