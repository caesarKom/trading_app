import CustomToastMessage from './components/global/CustomToastMessage';

interface ToastConfigProps {
  msg: string;
}

export const toastConfig = {
  successToast: ({ props }: { props: ToastConfigProps }) => (
    <CustomToastMessage msg={props.msg} type="successToast" />
  ),
  warningToast: ({ props }: { props: ToastConfigProps }) => (
    <CustomToastMessage msg={props.msg} type="warningToast" />
  ),
  normalToast: ({ props }: { props: ToastConfigProps }) => (
    <CustomToastMessage msg={props.msg} type="normalToast" />
  ),
};

export default { toastConfig };
