import { settings } from './_build/Plasma_SkillChangeState_parameters';

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
