const fs = require('fs');
const PDFDocument = require('pdfkit-table');

const { quantity, shortMU } = require('../utils/generalFunc');
const { translateServices } = require('../utils/translateUnits');

exports.InvoicePDF = (res, invoiceData, totalInvoice) => {
  const {
    clientId: client,
    userId: user,
    orders,
    dueDate,
    remainder,
  } = invoiceData;

  const invoice = new PDFDocument({
    info: {
      Title: `Factura`,
    },
    size: 'A4',
    font: 'services/fonts/Titillium/TitilliumWeb-Regular.ttf',
    margin: 20,
    bufferPages: true,
  });

  invoice.pipe(
    fs.createWriteStream(`./uploads/invoices/Factura[${client.name}].pdf`)
  );

  invoice.rect(25, 25, 560, 100);
  invoice.fill('#589ee5').stroke();
  invoice
    .fill('#fff')
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .fontSize(24)
    .text('FACTURA', 50, 30, { align: 'right', characterSpacing: 5 })
    .fontSize(15)
    .text(`serie ${user.invoiceSeries}/nr. ${user.invoiceStartNumber}`, {
      align: 'right',
    });
  invoice
    .fontSize(10)
    .text(`Data emiterii: ${new Date().toLocaleDateString('ro')}`, {
      align: 'right',
    });
  invoice
    .fontSize(10)
    .text(`Data scadenta: ${new Date(dueDate).toLocaleDateString('ro')}`, {
      align: 'right',
    });

  invoice.font('services/fonts/Titillium/TitilliumWeb-Regular.ttf');
  invoice.fill('black');
  invoice
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .fontSize(10)
    .text(`Furnizor: ${user.name}`, 25, 140, { width: 270 })
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(`Sediul: ${user.registeredOffice}`)
    .text(`Nr. de inregistrare: ${user.registrationNumber}`)
    .text(`Cod fiscal: ${user.taxNumber}`)
    .text(`Banca: ${user.bank}`)
    .text(`IBAN: ${user.iban}`);

  invoice
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .fontSize(10)
    .text(`Client: ${client.name}`, 300, 140, { width: 280 })
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(`Sediul: ${client.registeredOffice}`)
    .text(`Nr. de inregistrare: ${client.registrationNumber}`)
    .text(`Cod fiscal: ${client.taxNumber}`)
    .text(`Banca: ${client.bank}`)
    .text(`IBAN: ${client.iban}`);

  invoice.rect(25, 260, 82, 18);
  invoice.fill('#079992');
  invoice
    .fill('#fff')
    .fontSize(10)
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .text('CONTACT', 30, 262, { characterSpacing: 5 });
  invoice.moveDown(0.5);
  invoice
    .fill('#000')
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(`Email: ${user.email}`, 25)
    .text(`Telefon: ${user.phone}`);

  invoice.rect(300, 260, 82, 18);
  invoice.fill('#079992');
  invoice
    .fill('#fff')
    .fontSize(10)
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .text('CONTACT', 305, 262, { characterSpacing: 5 });
  invoice.moveDown(0.5);
  invoice
    .fill('#000')
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(`Email: ${client.email}`, 300)
    .text(`Telefon: ${client.phone}`);

  const table = {
    headers: [
      { label: 'Nr.', headerColor: '#079992', headerOpacity: 0.5 },
      {
        label: 'Tip serviciu/Referinta client',
        headerColor: '#079992',
        headerOpacity: 0.5,
      },
      {
        label: 'Cantitate',
        headerColor: '#079992',
        headerOpacity: 0.5,
      },
      {
        label: 'UM',
        headerColor: '#079992',
        headerOpacity: 0.5,
      },
      {
        label: `Tarif (${client.currency}/unitate de tarifare)`,
        headerColor: '#079992',
        headerOpacity: 0.5,
      },
      {
        label: `Valoare (${client.currency})`,
        headerColor: '#079992',
        headerOpacity: 0.5,
      },
    ],

    rows: [[0, 'Sold client', '', '', '', client.remainder]],
  };

  orders.forEach((order, index) => {
    table.rows.push([
      index + 1,
      `Servicii ${translateServices([order.service])} / ${order.reference}`,
      `${order.count.toLocaleString('ro')}`,
      `${quantity(order)}`,
      `${order.rate.toLocaleString('ro')}/${shortMU(order)}`,
      order.total.toLocaleString('ro'),
    ]);
  });

  invoice.table(table, {
    width: 560,
    padding: 5,
    x: 25,
    y: 350,
    columnsSize: [40, 170, 80, 90, 100, 80],
    divider: {
      header: { disabled: false, width: 2, opacity: 1 },
      horizontal: { disabled: false, opacity: 0.2 },
    },
    prepareHeader: () => {
      invoice
        .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
        .fontSize(10);
    },
    prepareRow: () =>
      invoice
        .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
        .fontSize(8),
  });

  invoice.moveDown();
  invoice
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .fontSize(14)
    .text(
      `DE PLATA: ${totalInvoice.toLocaleString('ro', {
        style: 'currency',
        currency: client.currency,
      })}`,
      {
        align: 'right',
      }
    );
  invoice.moveDown();
  invoice
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .fontSize(10)
    .text(
      `Rest de plata: ${remainder.toLocaleString('ro', {
        style: 'currency',
        currency: client.currency,
      })}`,
      {
        align: 'right',
      }
    );

  invoice.moveDown(3);

  invoice.rect(invoice.x, invoice.y, 560, 20).stroke();
  invoice
    .text(' Plata se va face in contul: ', { continued: true })
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .text(user.iban, { continued: true })
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(' deschis la banca: ', { continued: true })
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .text(user.bank, { continued: true })
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(', pana cel tarziu la: ', { continued: true })
    .font('services/fonts/Titillium/TitilliumWeb-Bold.ttf')
    .text(new Date(dueDate).toLocaleDateString('ro'), { continued: false });

  invoice.moveDown(1);

  invoice
    .font('services/fonts/Titillium/TitilliumWeb-Regular.ttf')
    .text(user.invoiceNotes);

  invoice.moveDown(2);

  invoice.text('Document generat cu ZenT Freelance');

  invoice.end();

  invoice.pipe(res);
};
