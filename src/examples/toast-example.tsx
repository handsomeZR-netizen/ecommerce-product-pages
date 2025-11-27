// Example usage of toast notifications
// This file demonstrates how to use the sonner toast component

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function ToastExample() {
  return (
    <div className="flex gap-4 p-4">
      <Button onClick={() => toast.success('操作成功！')}>成功通知</Button>

      <Button onClick={() => toast.error('操作失败！')}>错误通知</Button>

      <Button onClick={() => toast('这是一条普通消息')}>普通通知</Button>

      <Button
        onClick={() =>
          toast('商品已添加', {
            description: '您可以在购物车中查看',
          })
        }
      >
        带描述的通知
      </Button>
    </div>
  );
}
