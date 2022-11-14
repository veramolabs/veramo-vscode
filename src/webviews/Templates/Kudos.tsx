import * as React from "react";
import { VerifiableCredential } from "@veramo/core";

export const Kudos = ({ credential } : { credential: VerifiableCredential }) => {

  return <div className="credential__kudos">
    <div className="credential__kudos_content">
      <div>
        <div className="credential__kudos_title">
          <span className="credential__kudos_emoji">🏆</span> Kudos to <a 
            href={credential.credentialSubject.id} 
            className="veramo__pointer">{credential.credentialSubject.name}</a>
        </div>
        <div className="credential__kudos_kudos">
          {credential.credentialSubject.kudos}
        </div>
      </div>
      <a href={credential.credentialSubject.id} ><img src={credential.credentialSubject.avatar} className='credential__kudos_avatar' /></a>
    </div>
    <div className="credential__kudos_footer">
      <a href={credential.credentialSubject.authorId}>
      <img 
        className="credential__kudos_author_avatar veramo__pointer"
        src={credential.credentialSubject.authorAvatar} 
        />
      </a>
      <a 
        className="credential__kudos_author_name veramo__pointer"
        href={credential.credentialSubject.authorId}
        >{credential.credentialSubject.authorName}</a>

      <span className="credential__kudos_footer_spacer">・</span>
      <a 
        className="veramo__pointer"
        href={
          `https://discord.com/channels/${credential.credentialSubject.guildId}/${credential.credentialSubject.channelId}/${credential.id}`
        }>

        {credential.credentialSubject.channelName}
      </a>
      <span className="credential__kudos_footer_spacer">・</span>
      <a 
        className="veramo__pointer"
        href={
          `https://discord.com/channels/${credential.credentialSubject.guildId}/${credential.credentialSubject.channelId}/${credential.id}`
        }>
        <img className="credential__kudos_guild_avatar" src={credential.credentialSubject.guildAvatar} />
        {credential.credentialSubject.guildName}
      </a>
    </div>
  </div>;
};
