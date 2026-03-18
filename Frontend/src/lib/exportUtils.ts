export const exportToCSV = (data: any[], fileName: string) => {
    if (!data || data.length === 0) return;

    // Extract headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [
        headers.join(','), // header row
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas
            const escaped = ('' + value).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(','))
    ];

    // Create a blob and download link
    const csvContent = "\uFEFF" + csvRows.join('\n'); // Add BOM for Excel UTF-8 support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
