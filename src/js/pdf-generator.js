// PDF Receipt Generator for Indian e-commerce

// Initialize jsPDF
// function initializePDF() {
//     if (typeof window.jsPDF === 'undefined') {
//         console.error('jsPDF library not loaded');
//         return null;
//     }
//     return window.jsPDF;
// }

// Initialize jsPDF
function initializePDF() {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
        console.error('jsPDF library not loaded');
        return null;
    }
    return window.jspdf.jsPDF; // return the class directly
}


// Generate PDF receipt
function generatePDFReceipt(order) {
    const jsPDF = initializePDF();
    if (!jsPDF) {
        showToast('PDF generation failed: Library not loaded', 'error');
        return;
    }
    const doc = new jsPDF();
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        // Colors
        const primaryColor = '#ff6b35';
        const secondaryColor = '#333333';
        const lightGray = '#666666';
        
        // Header
        addHeader(doc, pageWidth, primaryColor);
        
        // Order Information
        let yPosition = addOrderInfo(doc, order, pageWidth, 40);
        
        // Customer Information
        yPosition = addCustomerInfo(doc, order, yPosition + 10);
        
        // Items Table
        yPosition = addItemsTable(doc, order, yPosition + 10, pageWidth);
        
        // Payment Summary
        yPosition = addPaymentSummary(doc, order, yPosition + 10, pageWidth);
        
        // Footer
        addFooter(doc, pageHeight, pageWidth);
        
        // Save the PDF
        const fileName = `IndiaShop_Receipt_${order.id}.pdf`;
        doc.save(fileName);
        
        showToast('Receipt downloaded successfully! 📄', 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Failed to generate PDF receipt', 'error');
    }
}

// Add header to PDF
function addHeader(doc, pageWidth, primaryColor) {
    // Receipt Title
    doc.setFontSize(18);
    doc.setTextColor('#333333');
    doc.setFont(undefined, 'bold');
    doc.text('PURCHASE RECEIPT', pageWidth - 75, 15, { align: 'right' });

    // Company Logo/Name
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('IndiaShop', 20, 25);
    
    // Tagline
    doc.setFontSize(10);
    doc.setTextColor('#666666');
    doc.setFont(undefined, 'normal');
    doc.text('Your Trusted E-commerce Partner in India', 20, 32);
    
    // Horizontal line
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 35, pageWidth - 20, 35);
}

// Add order information
function addOrderInfo(doc, order, pageWidth, startY) {
    doc.setFontSize(11);
    doc.setTextColor('#333333');
    doc.setFont(undefined, 'bold');
    
    // Left side - Order details
    doc.text('Order Details:', 20, startY);
    doc.setFont(undefined, 'normal');
    doc.text(`Order ID: ${order.id}`, 20, startY + 8);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 20, startY + 16);
    doc.text(`Time: ${new Date(order.createdAt).toLocaleTimeString('en-IN')}`, 20, startY + 24);
    doc.text(`Status: ${getStatusText(order.status)}`, 20, startY + 32);
    
    // Right side - Delivery details
    doc.setFont(undefined, 'bold');
    doc.text('Delivery Information:', pageWidth - 100, startY);
    doc.setFont(undefined, 'normal');
    doc.text(`Expected: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}`, pageWidth - 100, startY + 8);
    doc.text(`Method: Standard Delivery`, pageWidth - 100, startY + 16);
    doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, pageWidth - 100, startY + 24);
    
    return startY + 40;
}

// Add customer information
function addCustomerInfo(doc, order, startY) {
    doc.setFontSize(11);
    doc.setTextColor('#333333');
    doc.setFont(undefined, 'bold');
    doc.text('Customer Information:', 20, startY);
    
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${order.customerInfo.name}`, 20, startY + 8);
    doc.text(`Email: ${order.customerInfo.email}`, 20, startY + 16);
    doc.text(`Phone: ${order.customerInfo.phone}`, 20, startY + 24);
    
    // Shipping Address
    doc.setFont(undefined, 'bold');
    doc.text('Shipping Address:', 20, startY + 35);
    doc.setFont(undefined, 'normal');
    
    // Split address into multiple lines if too long
    const addressLines = splitTextToLines(doc, order.shippingAddress, 150);
    addressLines.forEach((line, index) => {
        doc.text(line, 20, startY + 43 + (index * 8));
    });
    
    return startY + 43 + (addressLines.length * 8);
}

// Add items table
function addItemsTable(doc, order, startY, pageWidth) {
    const tableStartY = startY + 5;
    
    // Table header
    doc.setFillColor(255, 107, 53); // #ff6b35
    doc.rect(20, tableStartY, pageWidth - 40, 12, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('Item', 25, tableStartY + 8);
    doc.text('Qty', pageWidth - 80, tableStartY + 8);
    doc.text('Price', pageWidth - 65, tableStartY + 8);
    doc.text('Total', pageWidth - 110, tableStartY + 8);
    
    // Table rows
    let currentY = tableStartY + 15;
    doc.setTextColor('#333333');
    doc.setFont(undefined, 'normal');
    
    order.items.forEach((item, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');
        }
        
        // Item name (truncate if too long)
        const itemName = item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name;
        doc.text(itemName, 25, currentY + 3);
        
        // Quantity
        doc.text(item.quantity.toString(), pageWidth - 80, currentY + 3);
        
        // Price
        doc.text(`INR-${item.price.toLocaleString('en-IN')}`, pageWidth - 65, currentY + 3);
        
        // Total
        doc.text(`INR-${item.total.toLocaleString('en-IN')}`, pageWidth - 100, currentY + 3, { align: 'right' });
        
        currentY += 12;
    });
    
    // Table border
    doc.setDrawColor('#dddddd');
    doc.setLineWidth(0.5);
    doc.rect(20, tableStartY, pageWidth - 40, currentY - tableStartY);
    
    return currentY;
}

// Add payment summary
function addPaymentSummary(doc, order, startY, pageWidth) {
    const summaryStartY = startY + 5;
    
    doc.setFontSize(11);
    doc.setTextColor('#333333');
    
    // Summary box
    doc.setDrawColor('#dddddd');
    doc.setLineWidth(0.5);
    doc.rect(pageWidth - 135, summaryStartY, 100, 50);
    
    // Summary items
    doc.setFont(undefined, 'normal');
    doc.text('Subtotal:', pageWidth - 120, summaryStartY + 10);
    doc.text(`INR-${order.pricing.subtotal.toLocaleString('en-IN')}`, pageWidth - 40, summaryStartY + 10, { align: 'right' });
    
    doc.text('Delivery:', pageWidth - 120, summaryStartY + 18);
    const deliveryText = order.pricing.deliveryCharge === 0 ? 'FREE' : `INR-${order.pricing.deliveryCharge}`;
    doc.text(deliveryText, pageWidth - 40, summaryStartY + 18, { align: 'right' });

    doc.text('GST (18%):', pageWidth - 120, summaryStartY + 26);
    doc.text(`INR-${order.pricing.gst.toLocaleString('en-IN')}`, pageWidth - 40, summaryStartY + 26, { align: 'right' });

    // Total line
    doc.setDrawColor('#ff6b35');
    doc.setLineWidth(1);
    doc.line(pageWidth - 130, summaryStartY + 32, pageWidth - 40, summaryStartY + 32);
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', pageWidth - 125, summaryStartY + 42);
    doc.text(`INR-${order.pricing.total.toLocaleString('en-IN')}`, pageWidth - 40, summaryStartY + 42, { align: 'right' });

    // Payment method info
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#666666');
    doc.text(`Paid via: ${order.paymentMethod.toUpperCase()}`, 20, summaryStartY + 20);
    
    if (order.paymentStatus === 'paid') {
        doc.setTextColor('#28a745');
        doc.text('✓ Payment Confirmed', 20, summaryStartY + 28);
    } else {
        doc.setTextColor('#ffc107');
        doc.text('⚠ Payment Pending', 20, summaryStartY + 28);
    }
    
    return summaryStartY + 55;
}

// Add footer
function addFooter(doc, pageHeight, pageWidth) {
    const footerY = pageHeight - 30;
    
    // Footer line
    doc.setDrawColor('#dddddd');
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    
    // Footer text
    doc.setFontSize(9);
    doc.setTextColor('#666666');
    doc.setFont(undefined, 'normal');
    
    doc.text('Thank you for shopping with IndiaShop!', 20, footerY);
    doc.text('For support: support@indiashop.com | +91-800-123-4567', 20, footerY + 8);
    doc.text('This is a computer generated receipt.', 20, footerY + 16);
    
    // Page info
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth - 20, footerY, { align: 'right' });
    doc.text('Page 1 of 1', pageWidth - 20, footerY + 8, { align: 'right' });
    
    // Website
    doc.setTextColor('#ff6b35');
    doc.text('www.indiashop.com', pageWidth - 20, footerY + 16, { align: 'right' });
}

// Helper function to split text into lines
function splitTextToLines(doc, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines;
}

// Generate invoice for business customers
function generateInvoicePDF(order) {
    const { jsPDF } = initializePDF();
    if (!jsPDF) {
        showToast('PDF generation failed: Library not loaded', 'error');
        return;
    }
    
    try {
        const doc = new jsPDF();
         doc.addFileToVFS("Roboto-Regular-normal.ttf", Roboto);
        doc.addFont("Roboto-Regular-normal.ttf", "Roboto", "normal");
        doc.setFont("Roboto");


        // Invoice header
        doc.setFontSize(20);
        doc.setTextColor('#ff6b35');
        doc.setFont(Roboto, 'bold');
        doc.text('TAX INVOICE', 20, 25);
        
        // GST details
        doc.setFontSize(10);
        doc.setTextColor('#333333');
        // doc.text('GSTIN: 07AAACI1681G1ZI', 20, 35);
        doc.text(20, 30, "this is gst no.")
        doc.text('PAN: AAACI1681G', 20, 42);
        doc.text('CIN: U74999DL2010PTC199788', 20, 49);
        
        // Invoice number
        doc.setFontSize(12);
        // doc.text(`Invoice No: INV-${order.id}`, pageWidth - 80, 25);
        doc.text(80, 25, "this is invoice no." )
        // doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, pageWidth - 80, 35);
        doc.text(80, 35, `Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`)
        
        // Add similar content as receipt but with GST details
        // ... (additional invoice-specific content)
        
        const fileName = `IndiaShop_Invoice_${order.id}.pdf`;
        doc.save(fileName);
        
        showToast('Invoice downloaded successfully! 📋', 'success');
        
    } catch (error) {
        console.error('Invoice generation error:', error);
        showToast('Failed to generate invoice', 'error');
    }
}

// Bulk receipt generation
function generateBulkReceipts(orders) {
    if (!orders || orders.length === 0) {
        showToast('No orders to generate receipts for', 'warning');
        return;
    }
    
    orders.forEach((order, index) => {
        setTimeout(() => {
            generatePDFReceipt(order);
        }, index * 500); // Delay to avoid overwhelming the browser
    });
    
    showToast(`Generating ${orders.length} receipts...`, 'success');
}

// Email receipt (simulation)
function emailReceipt(order, email) {
    // In a real application, this would send the PDF via email
    showToast(`Receipt will be sent to ${email}`, 'success');
    
    // Simulate email sending
    setTimeout(() => {
        showToast('Receipt sent successfully! 📧', 'success');
    }, 2000);
}