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

class UserModel extends Model {
    protected $trueTableName = 'user';
    protected $dbName = 'personalhomepage';
}
