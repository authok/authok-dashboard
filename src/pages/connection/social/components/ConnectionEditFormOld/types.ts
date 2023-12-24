//  编辑表单的属性
export interface ConnectionEditFormProps {
  connection: API.SocialConnection;
  onSubmit: (values: any) => void | Promise<any>;
}
