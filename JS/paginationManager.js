export function paginateItems(items, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return {
        items: paginatedItems,
        totalPages,
        currentPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
}