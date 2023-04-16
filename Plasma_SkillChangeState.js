// Plasma_SkillChangeState 1.0.0
// Copyright (c) 2023 Plasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/11 1.0.0 公開
 */

/*:
 * @plugindesc 使用可能なスキルを変更するステート
 * @author Plasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param stateAndSkills
 * @desc 指定ステートにかかっている場合、対応するスキルのみ使用可能になります
 * @text ステートとスキル一覧
 * @type struct<StateAndSkills>[]
 * @default []
 *
 * @help
 * version: 1.0.0
 * 特定のステートにかかっている場合、対応するスキルのみ使用可能にします。
 */
/*~struct~StateAndSkills:
 * @param state
 * @text ステート
 * @type state
 * @default 0
 *
 * @param skills
 * @text スキル一覧
 * @type skill[]
 * @default []
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    stateAndSkills: JSON.parse(pluginParameters.stateAndSkills || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          state: Number(parsed.state || 0),
          skills: JSON.parse(parsed.skills || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
  };

  const stateAndSkills = settings.stateAndSkills;

  function Game_Actor_SkillChangeStateMixIn(gameActor) {
    const _skills = gameActor.skills;
    gameActor.skills = function () {
      const s = stateAndSkills.find(stateAndSkill => this.isStateAffected(stateAndSkill.state));
      if (s) {
        return s.skills.map(id => $dataSkills[id]);
      }
      return _skills.call(this);
    };
  }

  Game_Actor_SkillChangeStateMixIn(Game_Actor.prototype);

})();
