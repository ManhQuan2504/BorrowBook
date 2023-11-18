import borrowBookRouter from "./borrowBookRoute.js"

const router = (app) => {
    app.use('/api/borrowbook', borrowBookRouter);
}

export default router;