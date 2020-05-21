import MalaysiaMapData from './Malaysia.json';
import Echart, { ECharts } from 'echarts';

type BaseDataType = { name: string; value: number };

Echart.registerMap('Malaysia', MalaysiaMapData);
/**
 * @description 地图图表
 * @author angle
 * @date 2020-05-21
 * @class MapReport
 * @template DataType 数据结构
 */
class MapReport<DataType extends BaseDataType = BaseDataType> {
  /**
   * @description 地图dom
   * @private
   * @type {(HTMLDivElement | null)}
   * @memberof MapReport
   */
  private readonly _mapDom: HTMLDivElement | null;

  /**
   * @description 图表处理对象
   * @private
   * @type {(ECharts | null)}
   * @memberof MapReport
   */
  private _echarts: ECharts | null = null;
  /**
   * @description 点击事件
   * @private
   * @type {(Function | undefined)}
   * @memberof MapReport
   */
  private _clickHandler: Function | undefined;

  /**
   * @description 初始化
   * @author angle
   * @date 2020-05-22
   * @private
   * @param {DataType[]} initData
   * @memberof MapReport
   */
  private _init(initData: DataType[]): void {
    if (this._mapDom) {
      this._echarts = Echart.init(this._mapDom);
      this.renderData(initData);
    }
  }

  /**
   *Creates an instance of MapReport.
   * @author angle
   * @date 2020-05-21
   * @param {string} mapDomId map容器id
   * @param {DataType[]} [initData=[]] 初始化数据
   * @memberof MapReport
   */
  constructor(mapDomId: string, initData: DataType[] = []) {
    const dom: HTMLElement | null = document.getElementById(mapDomId);
    this._mapDom = dom instanceof HTMLDivElement ? dom : null;

    this._init(initData);
  }

  /**
   * @description 数据渲染
   * @author angle
   * @date 2020-05-22
   * @param {DataType[]} data
   * @memberof MapReport
   */
  public renderData(data: DataType[]): void {
    this._echarts?.setOption({
      visualMap: [
        {
          type: 'piecewise',
          splitNumber: 4,
          pieces: [
            { min: 900, label: '900及以上', color: '#77fafd' },
            { max: 900, min: 600, label: '600~900', color: '#5ac5cb' },
            { max: 600, min: 300, label: '300~600', color: '#449ba8' },
            { max: 300, label: '0~300', color: '#286381' }
          ],
          left: 'right',
          textStyle: {
            color: '#fff'
          }
        }
      ],
      series: [
        {
          type: 'map',
          map: 'Malaysia',
          data,
          label: {
            emphasis: {
              color: '#fff',
              offset: [20, -20]
            }
          }
        }
      ]
    });
  }
  /**
   * @description 事件监听
   * @author angle
   * @date 2020-05-22
   * @param {'click'} eventName 事件名
   * @param {Function} handler 处理函数
   * @memberof MapReport
   */
  public addEventListener(eventName: 'click', handler: Function): void {
    if (this._clickHandler) {
      this.removeEventListener(eventName);
    }
    this._echarts?.on(eventName, handler);
    this._clickHandler = handler;
  }
  /**
   * @description 事件移除
   * @author angle
   * @date 2020-05-22
   * @param {'click'} eventName 事件名
   * @param {Function} [handler] 处理函数
   * @memberof MapReport
   */
  public removeEventListener(eventName: 'click', handler?: Function): void {
    const fn: Function | undefined = this._clickHandler || handler;
    this._echarts?.off(eventName, fn);
    this._clickHandler = undefined;
  }
}

export default MapReport;
