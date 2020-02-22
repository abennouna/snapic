import { Injectable } from '@angular/core';

interface Icon {
  color?: string;
  filename?: string;
  left?: string;
  name: string;
  rotate?: string;
  top?: string;
  used?: boolean;
  fontSize?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmoticonService {
  private availableColors = [
    '#3880ff',
    '#3171e0',
    '#4c8dff',
    '#0cd1e8',
    '#0bb8cc',
    '#24d6ea',
    '#7044ff',
    '#633ce0',
    '#7e57ff',
    '#10dc60',
    '#0ec254',
    '#28e070',
    '#ffce00',
    '#e0b500',
    '#ffd31a',
    '#f04141',
    '#d33939',
    '#f25454',
    '#222428',
    '#1e2023',
    '#383a3e',
    '#989aa2',
    '#86888f',
    '#a2a4ab',
    '#f4f5f8',
    '#000000',
    '#d7d8da',
    '#f5f6f9',
  ];
  private availableEmoticons: Icon[] = [
    {
      name: 'happy',
    },
    {
      name: 'sad',
    },
    {
      name: 'skull',
    },
  ];
  private availableFoods: Icon[] = [
    {
      name: 'fast-food',
    },
    {
      name: 'pizza',
    },
    {
      name: 'restaurant',
    },
  ];
  public emoticons: Icon[] = [];
  private emoticonPath = 'assets/emoticons';
  public foods: Icon[] = [];
  private foodPath = 'assets/fast-food';

  /**
   */
  public addEmoticon() {
    // let availableEmoticons = this.availableEmoticons.filter(icon => !icon.used);

    // if (!availableEmoticons.length) {
    //   availableEmoticons = this.availableEmoticons;
    // }

    const emoticon = this.availableEmoticons[
      Math.floor(Math.random() * this.availableEmoticons.length)
    ];
    emoticon.used = true;
    emoticon.left = Math.floor(10 + Math.random() * window.innerWidth) + 'px';
    emoticon.top = Math.floor(10 + Math.random() * window.innerHeight) + 'px';
    emoticon.rotate = `rotate(${Math.floor(-45 + Math.random() * 90)}deg)`;
    emoticon.fontSize = Math.floor(10 + Math.random() * 100) + 'px';
    emoticon.color = this.availableColors[
      Math.floor(Math.random() * this.availableColors.length)
    ];

    this.emoticons.push({
      ...emoticon,
      filename: `${this.emoticonPath}/${emoticon.name}.svg`,
    });
  }

  /**
   */
  public addFood() {
    // let availableFoods = this.availableFoods.filter(icon => !icon.used);

    // if (!availableFoods.length) {
    //   availableFoods = this.availableFoods;
    // }

    const food = this.availableFoods[
      Math.floor(Math.random() * this.availableFoods.length)
    ];
    food.used = true;
    food.left = Math.floor(10 + Math.random() * window.innerWidth) + 'px';
    food.top = Math.floor(10 + Math.random() * window.innerHeight) + 'px';
    food.rotate = `rotate(${Math.floor(-45 + Math.random() * 90)}deg`;
    food.fontSize = Math.floor(10 + Math.random() * 100) + 'px';
    food.color = this.availableColors[
      Math.floor(Math.random() * this.availableColors.length)
    ];

    this.foods.push({
      ...food,
      filename: `${this.foodPath}/${food.name}.svg`,
    });
  }

  /**
   */
  public reset() {
    this.emoticons = [];
    this.foods = [];
  }
}
