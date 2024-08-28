import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.Atk = 10;
  }

  attack(monster) {
    // 플레이어의 공격
    const damage = this.Atk + Math.floor(Math.random() * 5) + 1;
    monster.hp -= damage;
    return damage;
  }
  Lvup(player) {
    player.hp += Math.floor(Math.random() * 100) + 40;
    player.Atk += Math.floor(Math.random() * 15) + 5;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 40 + stage * 40;
    this.Atk = 2 + stage * 3;
  }

  attack(player) {
    // 몬스터의 공격
    const damage = this.Atk + Math.floor(Math.random() * 5) + 1;
    player.hp -= damage;
    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.redBright("monster가 나타났다."))
  console.log(chalk.magentaBright(`\n=== 상태창 ===`));
  console.log(
    chalk.cyanBright(`| 지하 ${stage} 층 |`) +
    chalk.blueBright(
      `| player Hp: ${player.hp}, Atk: ${player.Atk} ~ ${player.Atk + 10} |`,
    ) +
    chalk.redBright(
      `| monster Hp: ${monster.hp}, Atk: ${monster.Atk} ~ ${monster.Atk + 10} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 다음층으로 도망친다(20%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');
    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    switch (choice) {
      case '1':
        logs.push(chalk.blueBright(`monster에게 ${player.attack(monster)}의 피해를 입혔다.`))
        logs.push(chalk.redBright(`monster의 반격에 ${monster.attack(player)}의 피해를 받았다.`))
        break;
      case '2':
        // logs.push(chalk.yellow('구현 준비중입니다..'));
        const ran = Math.floor(Math.random() * 4);
        if (ran === 1) {
          console.log(chalk.blueBright(`도망성공, monster가 녹아내립니다.`));
          return 1
        } else {
          logs.push(chalk.redBright(`monster의 공격에 ${monster.attack(player)}의 피해를 받았다.`))
        }
        break;
      default:
        logs.push(chalk.red('그런 선택지는 없다.'));
    }
    if (monster.hp <= 0) {
      return 1
    } else if (player.hp <= 0) {
      return 2
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    // 스테이지 클리어
    if (result === 1) {
      console.log(chalk.blueBright(`monster의 기운을 흡수합니다.`));
      player.Lvup(player)
      console.log(chalk.blueBright(`hp가 ${player.hp}, Atk이${player.Atk} ~ ${player.Atk + 10}(이)(가) 되었습니다.`));
      console.log(chalk.redBright(`던전의 어둠이 짙어집니다.`));
      readlineSync.question(`엔터를 눌러 다음층으로 이동.`);
      stage++;
    } else if (result === 2) {
      console.log(chalk.redBright(`던전이 당신을 흡수합니다.`));
      console.log(chalk.redBright(`던전의 어둠이 짙어집니다.`));
      break;
    }

    //게임 종료 조건
    if (stage > 10) {
      console.log(chalk.blueBright(`던전의 코어를 흡수합니다.`));
      console.log(chalk.blueBright(`집으로 귀환합니다.`));
      break;
    }
  }
}