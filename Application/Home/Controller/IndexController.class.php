<?php
/**
 * 首页控制器
 * User: 郭 奡
 * Date: 2018/4/9
 * Time: 10:12
 */

namespace Home\Controller;

use Think\Controller;

class IndexController extends Controller
{
    /**
     * 显示页面方法
     */
    public function index()
    {
        $this->display();
    }

}