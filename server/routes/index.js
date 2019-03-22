import staticView from './staticView'
import staticCollection from './staticCollection'

/**
 * 顶层路由控制器
 * @param app
 */
const routerDispatcher = function (app) {

    /**
     * 测试路由
     */
    app.use('/test', function (req, res) {
        res.end('test');
    });
};

export default routerDispatcher;
