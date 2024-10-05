import {
  CopyOutlined,
  DownloadOutlined,
  DownOutlined,
  InfoCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  ColorPicker,
} from 'antd';
import debounce from 'lodash-es/debounce';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useRef, useState } from 'react';

const { Option } = Select;

const HomePage: React.FC = () => {
  const [form] = Form.useForm();
  const [qrOptions, setQrOptions] = useState({
    value: 'https://szy-allen.com',
    size: 128,
    fgColor: '#000000',
    bgColor: 'transparent',
    level: 'M' as const,
    includeMargin: false,
    marginSize: 4,
    imageSettings: {
      src: '',
      height: 24,
      width: 24,
      excavate: false,
    },
  });
  const [fgColorType, setFgColorType] = useState('default');
  const [bgColorType, setBgColorType] = useState('none');
  const [sizeType, setSizeType] = useState('preset');
  const [marginType, setMarginType] = useState('default');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [embedImage, setEmbedImage] = useState(false);
  const [lastCustomFgColor, setLastCustomFgColor] = useState('#000000');
  const [lastCustomBgColor, setLastCustomBgColor] = useState('#ffffff');

  const qrCodeRef = useRef<SVGSVGElement>(null);

  const copyQRCode = () => {
    if (qrCodeRef.current) {
      const svgData = new XMLSerializer().serializeToString(qrCodeRef.current);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard
              .write([new ClipboardItem({ 'image/png': blob })])
              .then(() => {
                message.success('二维码已复制到剪贴板');
              })
              .catch(() => {
                message.error('复制失败，请重试');
              });
          }
        });
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgData = new XMLSerializer().serializeToString(qrCodeRef.current);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qrcode.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const debouncedSetQrOptions = useCallback(
    debounce((newOptions) => {
      setQrOptions((prevOptions) => ({ ...prevOptions, ...newOptions }));
    }, 300),
    [],
  );

  useEffect(() => {
    const formValues = form.getFieldsValue();
    debouncedSetQrOptions(formValues);
  }, [form, debouncedSetQrOptions]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    let updatedValues = { ...allValues };

    if ('fgColorType' in changedValues) {
      setFgColorType(changedValues.fgColorType);
      if (changedValues.fgColorType === 'default') {
        updatedValues.fgColor = '#000000';
      } else if (changedValues.fgColorType === 'custom') {
        updatedValues.fgColor = lastCustomFgColor;
      }
    }

    if ('bgColorType' in changedValues) {
      setBgColorType(changedValues.bgColorType);
      if (changedValues.bgColorType === 'none') {
        updatedValues.bgColor = 'transparent';
      } else if (changedValues.bgColorType === 'custom') {
        updatedValues.bgColor = lastCustomBgColor;
      }
    }

    if ('fgColor' in changedValues) {
      const newColor = typeof changedValues.fgColor === 'object' && 'toHexString' in changedValues.fgColor
        ? changedValues.fgColor.toHexString()
        : changedValues.fgColor;
      updatedValues.fgColor = newColor;
      setLastCustomFgColor(newColor);
    }

    if ('bgColor' in changedValues) {
      const newColor = typeof changedValues.bgColor === 'object' && 'toHexString' in changedValues.bgColor
        ? changedValues.bgColor.toHexString()
        : changedValues.bgColor;
      updatedValues.bgColor = newColor;
      setLastCustomBgColor(newColor);
    }

    // 确保 fgColor 和 bgColor 总是字符串
    if (updatedValues.fgColor && typeof updatedValues.fgColor === 'object') {
      updatedValues.fgColor = updatedValues.fgColor.toHexString();
    }

    if (updatedValues.bgColor && typeof updatedValues.bgColor === 'object') {
      updatedValues.bgColor = updatedValues.bgColor.toHexString();
    }

    // 确保前景色和背景色不同，且背景色不为透明时才进行比较
    if (updatedValues.bgColor !== 'transparent' && updatedValues.fgColor === updatedValues.bgColor) {
      if (updatedValues.fgColor === '#000000') {
        updatedValues.bgColor = '#ffffff';
      } else {
        updatedValues.fgColor = '#000000';
      }
    }

    if ('sizeType' in changedValues) {
      setSizeType(changedValues.sizeType);
    }
    if ('marginType' in changedValues) {
      setMarginType(changedValues.marginType);
      if (changedValues.marginType === 'default') {
        updatedValues.marginSize = 4;
      }
    }
    if ('embedImage' in changedValues) {
      setEmbedImage(changedValues.embedImage);
      if (!changedValues.embedImage) {
        updatedValues.imageSettings = {
          src: '',
          width: 24,
          height: 24,
          excavate: true,
        };
      }
    }
    if ('imageSettings' in changedValues) {
      if ('width' in changedValues.imageSettings) {
        updatedValues.imageSettings.height = changedValues.imageSettings.width;
      } else if ('height' in changedValues.imageSettings) {
        updatedValues.imageSettings.width = changedValues.imageSettings.height;
      }
      // 添加对excavate的处理
      if ('excavate' in changedValues.imageSettings) {
        updatedValues.imageSettings.excavate = changedValues.imageSettings.excavate;
      }
    }
    debouncedSetQrOptions(updatedValues);
  };

  return (
    <PageContainer ghost>
      <Row gutter={24} className="p-6">
        <Col span={12}>
          <Card title="二维码生成器设置" bordered={false} className="shadow-lg">
            <Form
              form={form}
              name="qr-form"
              initialValues={{
                ...qrOptions,
                fgColorType: 'default',
                bgColorType: 'none',
                fgColor: lastCustomFgColor,  // 添加这行
                bgColor: lastCustomBgColor,  // 添加这行
                sizeType: 'preset',
                marginType: 'default',
                embedImage: false,
              }}
              onValuesChange={handleValuesChange}
              layout="vertical"
            >
              <Form.Item
                name="value"
                label="内容"
                rules={[
                  { required: true, message: '请输入内容' },
                  { max: 200, message: '内容长度不能超过200个字符' },
                ]}
                tooltip={{
                  title: '要编码到二维码中的内容，最大长度为200个字符',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input className="rounded-md border" />
              </Form.Item>
              <Form.Item
                name="sizeType"
                label="大小"
                tooltip={{
                  title: '选择预设大小或自定义大小',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Radio.Group>
                  <Radio.Button value="preset">预设大小</Radio.Button>
                  <Radio.Button value="custom">自定义大小</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {sizeType === 'preset' ? (
                <Form.Item
                  name="size"
                  tooltip={{
                    title: '选择预设的二维码大小',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <Select className="rounded-md border">
                    <Option value={128}>小 (128x128)</Option>
                    <Option value={256}>中 (256x256)</Option>
                    <Option value={512}>大 (512x512)</Option>
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  name="size"
                  tooltip={{
                    title: '输入自定义的二维码大小',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <InputNumber
                    min={32}
                    max={1024}
                    className="rounded-md border"
                  />
                </Form.Item>
              )}
            
              <Form.Item
                name="fgColorType"
                label="前景色"
                tooltip={{
                  title: '选择二维码的颜色',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Radio.Group>
                  <Radio.Button value="default">默认</Radio.Button>
                  <Radio.Button value="custom">自定义</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {fgColorType === 'custom' && (
                <Form.Item
                  name="fgColor"
                  tooltip={{
                    title: '自定义二维码的颜色',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <ColorPicker className="w-8 h-8" />
                </Form.Item>
              )}
              <Form.Item
                name="bgColorType"
                label="背景色"
                tooltip={{
                  title: '选择背景色类型',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Radio.Group>
                  <Radio.Button value="none">无背景</Radio.Button>
                  <Radio.Button value="custom">自定义</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {bgColorType === 'custom' && (
                <Form.Item
                  name="bgColor"
                  tooltip={{
                    title: '自定义二维码的背景颜色',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <ColorPicker className="w-8 h-8" />
                </Form.Item>
              )}
              <Form.Item
                name="level"
                label="纠错级别"
                tooltip={{
                  title:
                    '二维码的容错能力，级别越高，二维码可以承受的损坏程度越大',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Select className="rounded-md border">
                  <Option value="L">低（可恢复7%的数据损失）</Option>
                  <Option value="M">中（可恢复15%的数据损失）</Option>
                  <Option value="Q">较高（可恢复25%的数据损失）</Option>
                  <Option value="H">最高（可恢复30%的数据损失）</Option>
                </Select>
              </Form.Item>
              <div className="mt-4">
                {showMoreOptions && (
                  <>
                    <Form.Item
                      name="marginType"
                      label="包含边距"
                      tooltip={{
                        title: '是否在二维码周围添加边距',
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Radio.Group>
                        <Radio.Button value="default">默认</Radio.Button>
                        <Radio.Button value="custom">自定义</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    {marginType === 'custom' && (
                      <Form.Item
                        name="marginSize"
                        label="边距大小"
                        tooltip={{
                          title: '自定义二维码周围的边距大小（像素）',
                          icon: <InfoCircleOutlined />,
                        }}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          className="rounded-md border"
                        />
                      </Form.Item>
                    )}
                    <Form.Item
                      name="embedImage"
                      label="嵌入图片"
                      valuePropName="checked"
                      tooltip={{
                        title: '是否在二维码中嵌入图片',
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Switch />
                    </Form.Item>
                    {embedImage && (
                      <>
                        <Form.Item
                          name={['imageSettings', 'src']}
                          label="嵌入图片URL"
                          tooltip={{
                            title: '要嵌入二维码中心的图片URL',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <Input className="rounded-md border" />
                        </Form.Item>
                        <Form.Item
                          name={['imageSettings', 'width']}
                          label="嵌入图片尺寸"
                          tooltip={{
                            title: '嵌入图片的宽度和高度（像素）',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            className="rounded-md border"
                          />
                        </Form.Item>
                        <Form.Item
                          name={['imageSettings', 'excavate']}
                          label="挖空二维码"
                          valuePropName="checked"
                          tooltip={{
                            title: '是否挖空二维码以放置嵌入图片',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <Switch />
                        </Form.Item>
                      </>
                    )}
                  </>
                )}
                <Form.Item>
                  <Button
                    type="link"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    icon={showMoreOptions ? <UpOutlined /> : <DownOutlined />}
                  >
                    {showMoreOptions ? '收起' : '更多参数'}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="生成的二维码" bordered={false} className="shadow-lg">
            <Space
              direction="vertical"
              align="center"
              style={{ width: '100%' }}
            >
              <div className="p-4 rounded-lg border border-gray-300">
                <QRCodeSVG ref={qrCodeRef} {...qrOptions} />
              </div>
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  onClick={copyQRCode}
                  className="text-white bg-blue-500 rounded-md"
                >
                  复制二维码
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={downloadQRCode}
                  className="text-white bg-green-500 rounded-md"
                >
                  导出图片
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;