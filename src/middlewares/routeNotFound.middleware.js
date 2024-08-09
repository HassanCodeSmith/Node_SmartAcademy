/**
 * Route Not Found
 */
const routeNotFound = (err, res) => {
    console.error("Route not found");
    res.send("<h3>Route Not Found</h3>");
};

export { routeNotFound };
