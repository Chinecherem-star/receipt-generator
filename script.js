const itemTemplate = () => {
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <input class="item-name" type="text" placeholder="Item name" />
    <input class="item-qty" type="number" min="1" value="1" />
    <input class="item-price" type="number" step="0.01" value="0.00" />
    <div class="row-total">$0.00</div>
    <button class="remove-item" type="button" aria-label="Remove item">×</button>
  `;

  return row;
};

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const calculateRowTotal = (row) => {
  const qty = parseFloat(row.querySelector('.item-qty').value || 0);
  const price = parseFloat(row.querySelector('.item-price').value || 0);
  const total = qty * price;
  row.querySelector('.row-total').textContent = money(total);
  return total;
};

const calculateTotals = () => {
  const rows = [...document.querySelectorAll('.item-row')];
  const subtotal = rows.reduce((sum, row) => sum + calculateRowTotal(row), 0);
  const taxRate = parseFloat(document.getElementById('taxRate').value || 0) / 100;
  const discount = parseFloat(document.getElementById('discount').value || 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discount;

  document.getElementById('totalAmount').textContent = money(total);

  const receiptBody = document.getElementById('receiptBody');
  receiptBody.innerHTML = rows
    .filter((row) => row.querySelector('.item-name').value.trim() || parseFloat(row.querySelector('.item-qty').value || 0))
    .map((row) => {
      const name = row.querySelector('.item-name').value || 'Custom Item';
      const qty = parseFloat(row.querySelector('.item-qty').value || 0);
      const price = parseFloat(row.querySelector('.item-price').value || 0);
      const totalValue = qty * price;

      return `
        <tr>
          <td>${name}</td>
          <td>${qty}</td>
          <td>${money(price)}</td>
          <td>${money(totalValue)}</td>
        </tr>
      `;
    })
    .join('');

  document.getElementById('previewSubtotal').textContent = money(subtotal);
  document.getElementById('previewTax').textContent = money(tax);
  document.getElementById('previewDiscount').textContent = money(discount);
  document.getElementById('previewGrandTotal').textContent = money(total);
};

const populatePreview = () => {
  document.getElementById('previewBusinessName').textContent =
    document.getElementById('businessName').value || 'Your Business';

  document.getElementById('previewReceiptNumber').textContent =
    document.getElementById('receiptNumber').value || 'INV-0000';

  const dateValue = document.getElementById('receiptDate').value;
  document.getElementById('previewDate').textContent = dateValue
    ? new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date not set';

  document.getElementById('previewAddress').textContent =
    document.getElementById('businessAddress').value || 'Business address';

  document.getElementById('previewPhone').textContent =
    document.getElementById('businessPhone').value || 'Phone';

  document.getElementById('previewEmail').textContent =
    document.getElementById('businessEmail').value || 'Email';

  document.getElementById('previewCustomerName').textContent =
    document.getElementById('customerName').value || 'Customer';

  document.getElementById('previewCustomerEmail').textContent =
    document.getElementById('customerEmail').value || 'customer@example.com';
};

const renderReceipt = () => {
  populatePreview();
  calculateTotals();
};

document.getElementById('addItemBtn').addEventListener('click', () => {
  const itemsContainer = document.getElementById('itemsContainer');
  const row = itemTemplate();
  itemsContainer.appendChild(row);

  row.querySelector('.item-name').addEventListener('input', renderReceipt);
  row.querySelector('.item-qty').addEventListener('input', renderReceipt);
  row.querySelector('.item-price').addEventListener('input', renderReceipt);
  row.querySelector('.remove-item').addEventListener('click', () => {
    if (document.querySelectorAll('.item-row').length > 1) {
      row.remove();
      renderReceipt();
    }
  });

  renderReceipt();
});

const attachRowListeners = (row) => {
  row.querySelector('.item-name').addEventListener('input', renderReceipt);
  row.querySelector('.item-qty').addEventListener('input', renderReceipt);
  row.querySelector('.item-price').addEventListener('input', renderReceipt);
  row.querySelector('.remove-item').addEventListener('click', () => {
    if (document.querySelectorAll('.item-row').length > 1) {
      row.remove();
      renderReceipt();
    }
  });
};

[...document.querySelectorAll('.item-row')].forEach(attachRowListeners);

['businessName', 'businessPhone', 'businessEmail', 'businessAddress', 'customerName', 'customerEmail', 'receiptNumber', 'receiptDate', 'taxRate', 'discount']
  .forEach((id) => {
    document.getElementById(id).addEventListener('input', renderReceipt);
  });

document.getElementById('generateBtn').addEventListener('click', renderReceipt);
document.getElementById('printBtn').addEventListener('click', () => window.print());

renderReceipt();
