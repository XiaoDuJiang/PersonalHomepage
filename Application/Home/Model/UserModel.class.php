<?php
/**
 * User模型层
 * Created by PhpStorm.
 * User: 郭奡
 * Date: 2018/4/2
 * Time: 13:07
 */

namespace Home\Model;

use Think\Model;

class UserModel extends Model
{
    protected $trueTableName = 'user';
    protected $dbName = 'personalhomepage';

    protected $_validate = array(
        //字段 验证规则 错误提示 验证条件 附加规则 验证时间
        array('username', 'require', '必须填写用户名', 1, null, 1),
        array('account', 'require', '必须填写账号', 1, null, 1),
        array('password', 'require', '必须填写密码', 1, null, 1),
        array('username', '', '用户名已经存在', 0, 'unique', 1),
        array('account', '', '账号已经存在', 0, 'unique', 1),
        array('email', 'email', '邮箱格式错误'),
        array('tel', '/^\d{11}$/', '手机号格式不正确'),
    );
}
