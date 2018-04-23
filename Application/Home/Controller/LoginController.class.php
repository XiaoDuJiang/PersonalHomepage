<?php
/**
 * 登录页面控制器
 * User: 郭 奡
 * Date: 2018/4/9
 * Time: 10:12
 */

namespace Home\Controller;

use Think\Controller;
use Think\Exception;

class LoginController extends Controller
{

    /**
     * 登录
     * @return mixed 返回登录结果
     */
    public function loginIn()
    {
        if (IS_AJAX) {
            //创建模型
            $userM = M('User');
            //如果存在
            if ($_POST['account'] && $_POST['password']) {
                try {
                    $userM->create();
                    $userLogic = D('User', 'Logic');
                    $result = $userLogic->UserLogin($userM);
                    $result = json_encode($result);
                    $this->ajaxReturn($result);
                } catch (Exception $e) {
                    $this->ajaxReturn('{"msg":"系统错误","status": 0}');
                }
            } else {
                $this->ajaxReturn('{"msg":"参数错误","status": 0}');
            }
        }
    }

    /**
     * 注册接口
     */
    public function registerAccount()
    {
        if (IS_AJAX) {
            //创建模型
            $userM = M('User');
            $userM->create();
            //title自动生成
            $userM->title = $_POST['username'] . '的小窝';
            //createtime生成
            $userM->createtime = date("Y-m-d", time());

            $userLogic = D('User', 'Logic');
            $result = $userLogic->userRegister($userM, $_POST['testcode'], $_POST['repwd']);
            $result = json_encode($result);
            $this->ajaxReturn($result);
        }

    }

    /**
     * 用户注销
     */
    public function userCancel()
    {
        if (IS_AJAX) {
            $userLogic = D('User', 'Logic');
            $result = $userLogic->userCancel();
            $result = json_encode($result);
            $this->ajaxReturn($result);
        }
    }

    /**
     * 通过session获取用户信息
     */
    public function getUserInfoBySession()
    {
        if (IS_AJAX) {
            $userLogic = D('User', 'Logic');
            $result = $userLogic->getUserInfoBySession();
            $result = json_encode($result);
            $this->ajaxReturn($result);
        }
    }
}
